use gtk::prelude::*;
use relm4::prelude::*;

pub struct LabelDisabled;

#[relm4::component(pub)]
impl SimpleComponent for LabelDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Label",
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
