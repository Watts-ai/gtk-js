use gtk::prelude::*;
use relm4::prelude::*;

pub struct SeparatorVertical;

#[relm4::component(pub)]
impl SimpleComponent for SeparatorVertical {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Separator {
            set_orientation: gtk::Orientation::Vertical,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
