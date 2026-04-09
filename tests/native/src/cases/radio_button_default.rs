use gtk::prelude::*;
use relm4::prelude::*;

pub struct RadioButtonDefault;

#[relm4::component(pub)]
impl SimpleComponent for RadioButtonDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CheckButton {
            set_label: Some("Radio"),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();

        // Create a second check button and group it with root to trigger radio mode.
        // This adds the "grouped" CSS class and changes the indicator to "radio".
        let other = gtk::CheckButton::new();
        root.set_group(Some(&other));

        ComponentParts { model, widgets }
    }
}
