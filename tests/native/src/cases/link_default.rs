use gtk::prelude::*;
use relm4::prelude::*;

pub struct LinkDefault;

#[relm4::component(pub)]
impl SimpleComponent for LinkDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::LinkButton {
            set_label: "Link",
            set_uri: "https://example.com",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
